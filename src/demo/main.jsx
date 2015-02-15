import React from 'react';
import clone from 'clone';

import Animove from '../component/animove.jsx';


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}


var style = {
  WebkitTransition: 'all 1s ease-out',
  transition: 'all ease-out 1s',
  width: '100%'
};


class Demo extends React.Component {

  state = { shifted: false, destroyed: false, list: [1, 2, 3] };

  render(){
    var calcStyle = clone(style);
    calcStyle.backgroundColor = this.state.shifted? 'rgb(0,0,255)': 'rgb(255,0,0)';

    var listNodes = this.state.list.map(item => {
      return <li className='anim' key={item}>
        {item}
      </li>;
    });

    return <div>
      <button onClick={this._onClick.bind(this)}>
        Shift and Shuffle
      </button>

      <button onClick={this._onDestroyClick.bind(this)}>
        Mount/Unmount Test
      </button>

      {this.state.shifted && <div>buyakasha</div>}

      <Animove element='ul'>
        {listNodes}
        somethingelse
      </Animove>

      <ul><li>aa</li><li>bb</li></ul>
    </div>;
  }

  _onClick(){
    this.setState({
      shifted: !this.state.shifted,
      list: shuffle(this.state.list)
    });
  }

  _onDestroyClick(){
    this.setState({ destroyed: !this.state.destroyed });
  }

}


React.render(<Demo />, document.getElementById('main'));
