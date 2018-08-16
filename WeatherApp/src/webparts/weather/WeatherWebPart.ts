// Author : Yogesh Sharma
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './Weather.module.scss';
import * as strings from 'weatherStrings';
import { IWeatherWebPartProps } from './IWeatherWebPartProps';
import { SPComponentLoader } from "@microsoft/sp-loader";

import * as $ from 'jquery';
require('simpleWeather');

export default class WeatherWebPart extends BaseClientSideWebPart<IWeatherWebPartProps> {
  private container: JQuery;

  constructor()
  {
      super();
      SPComponentLoader.loadCss('https://archlights1.sharepoint.com/sites/developer/SiteAssets/bootstrap.min.css');
      SPComponentLoader.loadCss('https://archlights1.sharepoint.com/sites/developer/SiteAssets/weather-icons.min.css');
  }

  public render(): void {
    if (this.renderedOnce === false) {
      this.domElement.innerHTML = `<div class="${styles.weather}"></div>`;
    }

    this.renderContents();
  }

  private renderContents(): void {
    var dtDay1;
    var dtDay2;
    var dtDay3;
    this.container = $(`.${styles.weather}`, this.domElement);

    const location: string = escape(this.properties.location);

    if (!location || location.length === 0) {

      this.container.html('<p>Please specify a location</p>');
      return;
    }

    const webPart: WeatherWebPart = this;

        fetch("https://api.openweathermap.org/data/2.5/forecast?q="+location+"&appid=b9b79725468f9bb5def22463168f54bc")
        .then(function(response){
          return (response.json());
        }).then(function(data){
          return (data.list);
        })
        .then(function(weather){
            var dtDay = new Date(weather[0].dt_txt.split(' ')[0]);
            dtDay1 = new Date(dtDay.setDate(dtDay.getDate()+1));
            var propsDay1 = webPart.getDayProps(dtDay1.format("yyyy-MM-dd hh:mm:ss"),weather);
            dtDay2 = new Date(dtDay1.setDate(dtDay1.getDate()+1));
            var propsDay2 = webPart.getDayProps(dtDay2.format("yyyy-MM-dd hh:mm:ss"),weather);
            dtDay3 = new Date(dtDay2.setDate(dtDay2.getDate()+1));;
            var propsDay3 = webPart.getDayProps(dtDay3.format("yyyy-MM-dd hh:mm:ss"),weather);
            const html: string =`<div class='container'><div class='row'><div class='col-md-4 col-md-offset-4'><div class='weather'><div class='current'><div class='info'><div>&nbsp;</div><div class='city'><small><small>CITY:</small></small> `+location+`</div><div class='temp'>`+((parseFloat(weather[0].main.temp)-273.15)+ 32).toPrecision(2)+`&deg; <small>F</small></div><div class='wind'><small><small>WIND:</small></small> `+weather[0].wind.speed+` km/h</div><div>&nbsp;</div></div><div class='icon'><img src="//openweathermap.org/img/w/`+weather[0].weather[0].icon+`.png"></img></div></div><div class='future'><div class='day'><h3>`+propsDay1.day+`</h3> <p><img src="//openweathermap.org/img/w/`+propsDay1.icon+`.png"></img></p><p><span>`+((parseFloat(propsDay1.temp_min)-273.15)+ 32).toPrecision(2)+`&deg; F - `+((parseFloat(propsDay1.temp_max)-273.15)+ 32).toPrecision(2)+`&deg; F </span></p></div><div class="day"><h3>`+propsDay2.day+`</h3><p><img src="//openweathermap.org/img/w/`+propsDay2.icon+`.png"></img></p><p><span>`+((parseFloat(propsDay2.temp_min)-273.15)+ 32).toPrecision(2)+`&deg; F - `+((parseFloat(propsDay2.temp_max)-273.15)+ 32).toPrecision(2)+`&deg; F </span></p></div><div class="day"><h3>`+propsDay3.day+`</h3><p><img src="//openweathermap.org/img/w/`+propsDay3.icon+`.png"></img></p><p><span>`+((parseFloat(propsDay3.temp_min)-273.15)+ 32).toPrecision(2)+`&deg; F - `+((parseFloat(propsDay3.temp_max)-273.15)+ 32).toPrecision(2)+`&deg; F </span></p></div></div></div></div></div></div>`;
            webPart.container.html(html);
            $('.current').removeAttr('style').css('background-image',`url('https://loremflickr.com/500/139/`+location+`')`);
            $('.icon').removeAttr('style').css('background-image',`url('http://openweathermap.org/img/w/`+weather[0].weather[0].icon+`.png')`);
          });


  }
  private getDay(date)
  {
    var h = new Date(date);
    return(h.toDateString().split(' ')[0]);
  }
  private getDayProps(dtDay1, weather)
  {
    dtDay1 = dtDay1.split(' ')[0];
    var tempArr = weather.filter(function (el) { return el.dt_txt.search(dtDay1)>-1 })
    tempArr  = tempArr.sort(function (b, a) { if ((a.main.temp_min) > (b.main.temp_min)) { return -1; } else { return 1; } });
    var tempArrMax  = tempArr.sort(function (b, a) { if ((a.main.temp_max) > (b.main.temp_max)) { return -1; } else { return 1; } });
    var dayProps = [];
    dayProps.push({day:this.getDay(dtDay1), icon:tempArrMax[0].weather[0].icon, temp_min:tempArr[0].main.temp_min, temp_max:tempArrMax[tempArrMax.length-1].main.temp_max});
    return (dayProps[0]);
  }
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('location', {
                  label: strings.LocationFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }

  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }
}
