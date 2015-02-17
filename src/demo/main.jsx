import '6to5/polyfill';
import React from 'react';
import _ from 'lodash';

import Animove from '../component/animove.jsx';
import Z from '../component/lazy-tag.jsx';

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

var count = 5;

class Demo extends React.Component {

  state = {
    shifted: false,
    destroyed: false,
    list: [1, 2, 3, 4],
    testColor: 'orange'
  };

  render(){
    var calcStyle = _.cloneDeep(style);
    calcStyle.backgroundColor = this.state.shifted? 'rgb(0,0,255)': 'rgb(255,0,0)';

    var listNodes = this.state.list.map(item => {
      return <li className='anim'
        style={{ backgroundColor: this.state.shifted? 'rgb(0,0,255)': 'rgb(255,0,0)' }}
        key={item}
      >
        {item}
      </li>;
    });

    return <div>
      <button onClick={this._onClick.bind(this)}>
        Shift and Shuffle
      </button>

      <button onClick={this._onTestClick.bind(this)}>
        Transition Event Test
      </button>

      <button onClick={this._onRemoveClick.bind(this)}>
        Remove Test
      </button>

      {!this.state.destroyed && <Animove tagName='ul'>
        {listNodes}
      </Animove>}

      <Z t='div' className='anim' style={{ backgroundColor: this.state.testColor }} onTransitionEnd={this._onTrans.bind(this)}>
        transition test
      </Z>
    </div>;
  }

  _onTrans(){
    console.log('transitioned');
  }

  componentDidMount(){

  }

  componentDidUpdate(){
    console.log(this.state.list);
  }

  _onClick(){
    this.setState({
      shifted: !this.state.shifted,
      list: this.state.list.concat([count++])
    });
  }

  _onTestClick(){
    this.setState({
      destroyed: !this.state.destroyed,
      testColor: Math.random() < 0.5? 'orange': 'purple'
    });
  }

  _onRemoveClick(){
    this.setState({
      //list: _.sortBy(this.state.list, _.identity)
      list: _(this.state.list).sample(this.state.list.length - 2).sortBy(_.identity).value()
    });
  }

}


React.render(<Demo />, document.getElementById('main'));
