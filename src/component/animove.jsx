import React from 'react/addons';
import clone from 'clone';


export default class Animove extends React.Component {

  static defaultProps = { tagName: 'div' };

  state = { movers: [] };

  render(){
    let { tagName, children, ...otherProps } = this.props;

    var kids = [];
    
    React.Children.forEach(this.props.children, kid => {
      //console.log(kid);
      
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
      
      var base = this.refs[kid.key || kid].getDOMNode();
      var rect = base.getBoundingClientRect();
      var parentRect = base.parentElement.parentElement.getBoundingClientRect();
      props.style.position = 'absolute';
      props.style.top = rect.top - parentRect.top;
      props.style.left = rect.left - parentRect.left;
      
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
  
  componentDidUpdate(prevProps, prevState){
    console.log('updating', prevState.movers, this.state.movers);
  
    if (!this.receivingProps){
      console.log('short foo');
      return;
    }
    console.log('k then');
    
    this.receivingProps = false;
      
    this.setMovers();
  }
 
};
