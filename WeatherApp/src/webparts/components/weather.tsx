import { IWeatherProps } from "./IWeatherProps";
import { IWeatherSwitch} from "./IWeatherSwitch";
import * as React from 'react';

export default class Weather extends React.Component<IWeatherProps, IWeatherSwitch>{

    constructor(props:IWeatherProps, state: IWeatherSwitch)
    {
      super(props);
      this.state = {
          show: true
      };
    }
    public render(): React.ReactElement<IWeatherProps>
    {
      return(<div className="container">
        <div className="row">
            <div className="col-md-4 col-md-offset-4">
                <div className="weather">
                    <div className="current">
                        <div className="info">
                            <div>&nbsp;</div>
                            <div className="city"><small><small>CITY:</small>{this.props.city}</small> </div>
                            <div className="temp">{this.props.temp}&deg; <small>F</small></div>
                            <div className="wind"><small><small>WIND:</small></small> {this.props.wind} km/h</div>
                            <div>&nbsp;</div>
                        </div>
                        <div className="icon">
                            <span className="wi-day-sunny"></span>
                        </div>
                    </div>
                    <div className="future">
                        <div className="day">
                            <h3>Mon</h3>
                            <p><span className="wi-day-cloudy"></span></p>
                        </div>
                        <div className="day">
                            <h3>Tue</h3>
                            <p><span className="wi-showers"></span></p>
                        </div>
                        <div className="day">
                            <h3>Wed</h3>
                            <p><span className="wi-rain"></span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>);

    }
}