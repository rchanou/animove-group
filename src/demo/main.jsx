import React from 'react/addons';
import clone from 'clone';

import Movable from '../component/movable.jsx';


var style = {
  WebkitTransition: 'all 3s ease-out',
  transition: 'all ease-out 3s'
};


class Demo extends React.Component {

  state = { shifted: false };

  render(){
    var calcStyle = clone(style);
    calcStyle.backgroundColor = this.state.shifted? 'rgb(0,0,255)': 'rgb(255,0,0)';

    return <div onClick={this._onClick.bind(this)}>
      {this.state.shifted && <div>buyakasha</div>}

      <Movable
        style={calcStyle}
      >
        Sup
      </Movable>

      <div>
        ttt
        <div>
          misc test stuff
        </div>
        <p>
          homiez
        </p>
      </div>
    </div>;
  }

  _onClick(){
    this.setState({ shifted: !this.state.shifted });
  }

  componentDidMount(){
    setTimeout(() => {
      this.forceUpdate();
    }.bind(this), 5000);
  }

}


React.render(<Demo />, document.getElementById('main'));
