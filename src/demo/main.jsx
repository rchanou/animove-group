import React from 'react/addons';
import objectAssign from 'object-assign';

import Movable from '../component/movable.jsx';


var style = {
  WebkitTransition: 'all 3s ease-out',
  transition: 'all ease-out 3s',
  backgroundColor: 'hsl(180,50%,50%)'
};


class Demo extends React.Component {

  state = { shifted: false };

  render(){
    return <div onClick={this._onClick.bind(this)}>
      {this.state.shifted && <div>buyakasha</div>}

      <Movable
        style={objectAssign({}, style, this.state.shifted? { backgroundColor: 'red' }: {})}
      >
        Sup
      </Movable>
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


React.render(<Demo />, document.body);
