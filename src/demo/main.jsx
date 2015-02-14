import React from 'react/addons';

import Movable from '../component/movable.jsx';


class Demo extends React.Component {

  state = { shifted: false };

  render(){
    return <div onClick={this._onClick.bind(this)}>
      {this.state.shifted && <div>buyakasha</div>}
      <Movable>
        Sup
      </Movable>
    </div>;
  }

  _onClick(){
    this.setState({ shifted: !this.state.shifted });
  }

}


React.render(<Demo />, document.body);
