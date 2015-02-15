import React from 'react/addons';
import clone from 'clone';


export default class Animove extends React.Component {

  static defaultProps = { tagName: 'div' };

  state = { movers: [] };

  render(){
    let { tagName, children, ...otherProps } = this.props;

    var kids = [];

    React.Children.forEach(this.props.children, kid => {
      var props;
      if (kid.props){
        props = clone(kid.props);
      } else {
        props = { children: kid };
      }
      props.key = (kid.key || kid);
      props.ref = props.key;

      if (!props.style){
        props.style = {};
      }
      props.style.visibility = 'hidden';

      var newKid = React.createElement(
        kid.type || 'span', props, kid.props.children
      );

      kids.push(newKid);
    });

    for (var mover of this.state.movers){
      let { children, ...props } = mover.props;

      var newKid = React.createElement(
        mover.type,
        props,
        children
      );

      kids.push(newKid);
    }

    return React.createElement(
      tagName, otherProps, kids
    );
  }

  setMovers(){
    var movers = [];

    React.Children.forEach(this.props.children, kid => {
      var props;
      if (kid.props){
        props = clone(kid.props);
      } else {
        props = { children: kid };
      }
      props.key = (kid.key || kid) + 'mover';

      if (!props.style){
        props.style = {};
      }

      var base = this.refs[kid.key || kid].getDOMNode();
      var rect = base.getBoundingClientRect();
      var parentRect = base.parentElement.parentElement.getBoundingClientRect();
      props.style.position = 'absolute';
      props.style.top = rect.top - parentRect.top;
      props.style.left = rect.left - parentRect.left;

      movers.push( { type: kid.type || 'span', props } );
    }.bind(this));

    this.setState({ movers });
  }

  componentDidMount(){
    this.setMovers();
  }

  componentWillReceiveProps(){
    this.receivingProps = true;
  }

  componentDidUpdate(prevProps, prevState){
    if (!this.receivingProps){
      return;
    }

    this.receivingProps = false;

    this.setMovers();
  }

};
