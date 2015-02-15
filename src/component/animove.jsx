import React from 'react/addons';
import clone from 'clone';


export default class Animove extends React.Component {

  static defaultProps = { tagName: 'div' };

  state = { movers: [] };

  render(){
    let { tagName, children, ...otherProps } = this.props;

    var kids = [];
    
    React.Children.forEach(this.props.children, kid => {
      console.log(kid);
      
      var newKid;
      if (kid.props){
        var newProps = clone(kid.props);
        newProps.key = kid.key;
        newProps.ref = kid.key;
        if (!newProps.style){
          newProps.style = {};
        }        
        newProps.style.visibility = 'hidden';
        
        newKid = React.createElement(
          kid.type, newProps, kid.props.children
        );
      } else {
        newKid = React.createElement(
          'span',
          { key: kid, ref: kid, style: { visibility: 'hidden' } },
          kid
        );
      }
      kids.push(newKid);
    });
    
    for (var mover of this.state.movers){
      let { children, ...props } = mover.props;
      //console.log('creating', mover.type, props, children);
      var newKid = React.createElement(
        mover.type,
        props,
        children
      );
      
      kids.push(newKid);
    }
    
    //console.log('kids', this.props.children);
    
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
      
      //props.style.position = 'absolute';
      var buddy = this.refs[kid.key || kid].getDOMNode();
      console.log(buddy);
      
      movers.push( { type: kid.type || 'span', props } );
    }.bind(this));
    //console.log('will change state', this.state, movers);
    this.setState({ movers });
  }
  
  componentDidMount(){
    this.setMovers();
  }
  
  componentWillReceiveProps(){
    this.receivingProps = true;
  }
  
  componentDidUpdate(){
    if (!this.receivingProps){
      return;
    }
    this.receivingProps = false;
      
    this.setMovers();
    
    /*
    var newProps = clone(otherProps);
    newProps.ref = 'me';

    if (!newProps.style){
      newProps.style = {};
    }

    newProps.style.visibility = 'hidden';
    delete newProps.style.transition;
    delete newProps.style.WebkitTransition;
    delete newProps.style.transitionDuration;
    delete newProps.style.WebkitTransitionDuration;
    delete newProps.style.transitionDelay;
    delete newProps.style.WebkitTransitionDelay;

    return React.createElement(tagName, newProps, children);
    */
  }
  
  /*
  componentDidMount(){
    var me = this.refs.me.getDOMNode();
    var parent = me.parentElement;//.parentElement;

    this.animatedNode = document.createElement(this.props.tagName);
    parent.appendChild(this.animatedNode);

    this.moveAnimatedComponent = () => {
      var rect = me.getBoundingClientRect();
      var parentRect = parent.parentElement.getBoundingClientRect();
      var top = rect.top - parentRect.top;
      var left = rect.left - parentRect.left;

      let { tagName, children, ...otherProps } = this.props;

      var newProps = clone(otherProps);
      if (!newProps.style){
        newProps.style = {};
      }
      newProps.style.position = 'absolute';
      newProps.style.top = top;
      newProps.style.left = left;

      var animatedComponent = React.createElement(
        tagName, newProps, children
      );

      React.render(animatedComponent, this.animatedNode);
    };

    this.moveAnimatedComponent();
  }

  componentDidUpdate(){
    this.moveAnimatedComponent();
  }

  componentWillUnmount(){
    React.unmountComponentAtNode(this.animatedNode);
  }
  */
};
