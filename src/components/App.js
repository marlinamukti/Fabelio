import React from 'react';
import '../css/App.css';
import '../../node_modules/uikit/dist/css/uikit.min.css';
// import { products } from './Products'
// import { furniture_style } from './Furniture_Style'

var initState = {
  delivery_time:[
      {id:1, value:"1 week", checked:false, daymin:0, daymax: 7},
      {id:2, value:"2 weeks", checked:false, daymin:8, daymax: 14},
      {id:3, value:"1 month", checked:false, daymin:15, daymax: 30},
      {id:4, value:"more", checked:false, daymin:31, daymax:5000}
  ]
}

var products
var furniture_style

class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      products: [],
      furniture_style: [],
      delivery_time: []
    }
  }

  componentDidMount(){
    fetch("https://www.mocky.io/v2/5c9105cb330000112b649af8")
    .then(data => data.json())
    .then(data => {
      // console.log(data.furniture_styles)
      let furnitureStyleCopy = []
      data.furniture_styles.forEach(fur => {
        furnitureStyleCopy.push({label:fur, value:fur, checked:false})
      })

      products = data.products
      furniture_style = furnitureStyleCopy

      this.setState({
        products: data.products,
        furniture_style: furnitureStyleCopy,
        delivery_time: initState.delivery_time
      })
    })


    // this.setState({
    //   // products:products,
    //   // furniture_style: furniture_style,
    //   delivery_time: initState.delivery_time
    // })
  }

  onSearchFurName = (event) => {
    //console.log(event.target.value)
    let productsCopy = [...products]
    let filteredProduct = productsCopy.filter( prod => prod.name.toLowerCase().includes(event.target.value.toLowerCase()))

    this.setState({
      products: filteredProduct
    })
  }

  onSearchFurstyle = (event) => {
      var furniture_styleCopy = [...furniture_style]

      var filteredFurstyle = furniture_styleCopy.filter( fur => {
        return fur.value.toLowerCase().includes(event.target.value.toLowerCase())
      })
      // console.log(filteredFurstyle)
      if(event.target.value !== ""){
        this.setState({
            furniture_style: filteredFurstyle
        })
      }
      else{
        this.setState({
            furniture_style:furniture_style
        })
      }
  }

  oncheckedFurStyle = (fur) => {
    // console.log(fur.value)
    let furniture_styleCopy = [...this.state.furniture_style]
    let productsCopy = [...products]
    let index = furniture_styleCopy.findIndex( f => f.label === fur.label)
    let filteredProducts = []
    furniture_styleCopy[index] = {label: fur.label, value: fur.value, checked: !fur.checked}

    let filteredStyle = []
    furniture_styleCopy.forEach(fur => {
        if(fur.checked){
            filteredStyle.push(fur)
        }
    })
    // console.log(filteredStyle)
    filteredProducts = productsCopy.filter(prod => {
        let style = prod.furniture_style
        let result = false

        filteredStyle.forEach( st => {
            if(style.includes(st.value)){
                result = true
            }
        })
        return result
    })

    this.setState({
        furniture_style: furniture_styleCopy
    })

    if(filteredStyle.length === 0){
        this.setState({
            products: products
        })
    }
    else{
        this.setState({
            products:filteredProducts
        })
    }
  }

  onChangeDelivTime = (event) => {
    // console.log(event.id)
    let productsCopy = [...products]
    let filteredProducts = []
    let delivtimeCopy = [...this.state.delivery_time]
    let index = delivtimeCopy.findIndex(d => d.id === event.id)
    delivtimeCopy[index] = {
        id: event.id, 
        value: event.value, 
        checked: !event.checked, 
        daymin: event.daymin, 
        daymax: event.daymax
    }
    let filteredDelivTime = []
    let isCheck = false

    delivtimeCopy.forEach(deliv =>{
        if(deliv.checked){
            filteredDelivTime.push(deliv)
            isCheck = true
        }
    })
    
    // console.log(filteredDelivTime)

    filteredProducts = productsCopy.filter(prod => {
        let delivery_time = parseInt(prod.delivery_time)
        let result = false
        filteredDelivTime.forEach(f => {
            if(delivery_time >= f.daymin && delivery_time <= f.daymax){
                result = true
            }
        })
        return result
    })

    // console.log(filteredProducts)

    this.setState({
        delivery_time: delivtimeCopy
    })

    if(isCheck){
        this.setState({
            products:filteredProducts
        })
    }
    else{
        this.setState({
            products:products
        })
    }
  }
  
  render(){
    return (
      <div>
        <div className="uk-section uk-section-primary bg-blue">
            <div className="uk-container uk-container-small">
                <div> 
                  <input type="text" className="uk-width-1-2 search-name" placeholder="Search Furniture"
                    onChange={this.onSearchFurName}
                  ></input>
                </div>
                <div className="divSearchContainer">
                    {/* <ReactMultiSelectCheckboxes options={this.state.furniture_style}></ReactMultiSelectCheckboxes> */}
                    <div className="divSearchFurstyle">
                      <input type="text" className="uk-input" placeholder="Furniture Styles" onChange={this.onSearchFurstyle}></input>
                      
                      <div data-uk-dropdown="mode: click">
                        {this.state.furniture_style.map(fur => 
                          <FurnitureStyle key={fur.label} 
                              furniture_style={fur}
                              oncheckedFur={() => this.oncheckedFurStyle(fur)}>
                          </FurnitureStyle>)
                        }
                      </div>
                    </div>
                    
                    
                    <div className="divSearchDelivTime">
                        <button className="uk-button uk-button-default uk-width-1-1 button-deliv-search" type="button" tabIndex="-1">
                            <span >Delivery Time</span>
                            <span style={{float: "right", marginTop: "10px"}} data-uk-icon="icon: triangle-down"></span>
                        </button>
                        <div data-uk-dropdown="mode: click">
                            {this.state.delivery_time.map(delivtime => (
                                <DeliveryTime key={delivtime.id} delivtime={delivtime} onChangeDelivTime={() => this.onChangeDelivTime(delivtime)}></DeliveryTime>
                            ))}
                            
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="uk-section uk-section-default">
            <div className="uk-container uk-container-small">
                <div className="uk-grid-match uk-grid-column-small uk-grid-row-large uk-child-width-1-2@s uk-text-left uk-grid">
                    {this.state.products.map(prod => (
                        <Product key={prod.name} product={prod}></Product>
                    ))}
                </div>
            </div>
        </div>
    </div>
    );
  }
}

class Product extends React.Component{
  render(){
      const {product} = this.props
      return(
          <div className="uk-card uk-card-default uk-card-body">
              <div className="container-prod1">
                  <span className="product-name">{product.name}</span>
                  <span className="product-price">{product.price}</span>
              </div>
              <div className="product-desc">
                  {product.description}
              </div>
              <div className="product-style">
                  {product.furniture_style.map(p => p+" ")}
              </div>
              <div className="product-delivday">
                  {product.delivery_time}
              </div>
          </div>
      )
  }
}

class FurnitureStyle extends React.Component{
  render(){
      const {furniture_style} = this.props
      return(
          <div>
              <label>
              <input
                  name="optStyle"
                  type="checkbox"
                  checked={furniture_style.checked}
                  value={furniture_style.value}
                  onChange={this.props.oncheckedFur} />
                  {furniture_style.label}
              </label>
          </div>
          
      )
  }
}

class DeliveryTime extends React.Component{
  render(){
    const {delivtime} = this.props
    return(
      <div>
        <label>
            <input type="checkbox" value={delivtime.value} onChange={this.props.onChangeDelivTime} checked={delivtime.checked}></input>
            {delivtime.value}
        </label>
      </div>
    )
  }
}
export default App;
