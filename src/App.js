import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import FacebookProvider, { Login, search } from 'react-facebook';
import graph from 'fb-react-sdk';

const ACCESS_TOKEN =  "";

class App extends Component {
  constructor() {
    super();

    this.state = {
      search: '',
      data: []
    };

    this.searchFacebook = this.searchFacebook.bind(this);
  }
  searchFacebook(event){
    this.setState({
      search: event.target.value
    });

    graph.get('search', 
    {
      fields: 'name,likes',
      q: event.target.value, 
      type: 'page', 
      limit: 1000, 
      access_token: ACCESS_TOKEN
    }, 
    (err, res) => {
      if(res && res.data){
        let items = [];
        
        res.data.map(item => {
          if(item.likes){
            item.likes = item.likes.data.map((like) => {
              return { name: item.name, like: like.name};
              
            });            
          }
          if(item.likes){
            items = items.concat(item.likes);
          }
          
        });
        this.setState({
          data: items
        });
      }
    });
  }
  
  render() {
    const columns = [{
      Header: 'Name',
      accessor: 'name'

    },{
      Header: 'Likes',
      accessor: 'like'
      
    }
  ];

    return (
      <div>
        <input type="text" value={this.state.search} onChange={this.searchFacebook}/> 
        <ReactTable
          data={this.state.data}
          columns={columns}
          pivotBy={['name']}
        />
      </div>
    );
  }
}

export default App;
