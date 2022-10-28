import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { ArticleMessage } from 'commons';
import { ArticlesGrid } from './articles/Articles.Grid';
import { ArticlesService } from './services/Articles.service';

function App() {
  
  const [articles,setArticles] = useState<ArticleMessage[]>([])
  
  const service = new ArticlesService();

  useEffect(()=>{
    document.title ="Digital Accounts IT Challenge"
  })


  useEffect(()=>{
    service.list(1,10).then((data)=>{
      setArticles(data);
    }).catch(()=>{
      alert('plz try again later');
    })
  },[])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Digital Accounts IT Challenge
          </Typography>
        </Toolbar>
      </AppBar>
      <ArticlesGrid articles={articles} />
    </Box>
  );
}

export default App;
