import React, { useEffect, useState } from 'react';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AppBar, Box, Container, Pagination, Toolbar, Typography } from '@mui/material';
import { ArticleDto } from "commons/src/patterns/articles";
import { ArticlesGrid } from './articles/Articles.Grid';
import { ArticlesService, CachingException } from './services/Articles.service';
import { Stack } from '@mui/system';

function App() {
  
  const [articles,setArticles] = useState<ArticleDto[]>([])
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
    }).catch((e:Error)=>{
      if(e instanceof CachingException){
        alert('backend caching,try again later');
      }else{
        alert('unable to reach the server,try again later');
      }
      
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
        <Pagination count={totalPages} page={page} color="primary" onChange={handlePaginationChange} siblingCount={2} boundaryCount={2} />
      </Stack>
    </Container>
  );
}

export default App;
