import { h , Component } from "preact"

export default class Map extends Component {

  componentDidMount() {
    window.mapboxgl.accessToken = "pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ";
    this.map = new window.mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v9",
      // center: [ -74.50, 40 ],
      center: [ -77.0675577, 38.880812 ],
      zoom: 11,
    });
  }

  render() {
    return (
      <div className="Map">
        <div class="container">
          <div id="map" />
        </div>
      </div>
    );
  }

}
