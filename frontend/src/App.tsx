import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AppBar, Box, Container, Pagination, Toolbar, Typography } from '@mui/material';
import { ArticleMessage } from 'commons';
import { ArticlesGrid } from './articles/Articles.Grid';
import { ArticlesService } from './services/Articles.service';
import { Stack } from '@mui/system';

function App() {
  
  const [articles,setArticles] = useState<ArticleMessage[]>([])
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPage] = useState<number>(1)
  
  const service = new ArticlesService();

  const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
    goToPage(value);
  };

  const goToPage = (page=1) => {
    service.list(page, 12).then((data)=>{
      setArticles(data.data);
      setPage(data.page)
      setTotalPage(data.totalPages)
    }).catch((e)=>{
      console.log(e)
      alert('plz try again later');
    })
  }

  useEffect(()=>{
    document.title ="Digital Accounts IT Challenge"
  })


  useEffect(()=>{
    goToPage(1)
  },[])

  
  return (
    <Container maxWidth="lg">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Digital Accounts IT Challenge
          </Typography>
        </Toolbar>
      </AppBar>
      <Box marginTop={4}>
        <ArticlesGrid articles={articles} />
      </Box>
      <Stack marginTop={4} alignItems={'center'}>
        <Pagination count={totalPages} page={page} color="primary" onChange={handlePaginationChange} />
      </Stack>
    </Container>
  );
}

export default App;
