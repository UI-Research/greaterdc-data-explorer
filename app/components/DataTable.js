import { h, Component } from "preact"

export default class DataList extends Component {

  render() {
    const { filters: { geography, topic, indicator }, area } = this.props;

    if (!area || !geography || !topic || !indicator) {
      return (
        <div class="DataTable">
          <div class="container">
            {!geography && <p>Please select a geography on the filters above to see data</p>}
            {!topic && <p>Please select a topic on the filters above to see data</p>}
            {!indicator && <p>Please select a indicator on the filters above to see data</p>}
            {!area && <p>Please select an area on the map above to see data</p>}
          </div>
        </div>
      );
    }

    return (
      <div className="DataTable">
        <div className="container">

          <div class="DataTable-actions">
            <button>📄 Download Data</button>
            <a href="#">Sources and Notes</a>
          </div>

          <table>
            <thead>
              <tr>
                <td>Tract XYZ</td>
                <td>This tract</td>
                <td colSpan="3">All Tracts in DC</td>
              </tr>
              <tr>
                <td colSpan="2"></td>
                <td>Average</td>
                <td>Low</td>
                <td>High</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="5" className="indicator">Foreign Born</td>
              </tr>

              {[0,1,2,3,4].map(row => (
                <tr key={row}>
                  <td>% foreign born, 1980</td>
                  <td>1.9</td>
                  <td>6.4</td>
                  <td>0.0</td>
                  <td>38</td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
    );
  }
}
