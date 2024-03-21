import React from 'react';
import { useEffect, useState } from 'react'
 import './Home.css';
import axios from 'axios';
import { Container, Card } from "react-bootstrap"
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {

      const cachedData = await AsyncStorage.getItem('cachedData');

      if (cachedData) {

        const { cachedImages, lastapiRes} = JSON.parse(cachedData);
        setImages(cachedImages);

        const response = await axios.get(URL);
        
        if (JSON.stringify(response.data) !== lastapiRes) {
          const fetchedImages = response.data.photos.photo;
          setImages(fetchedImages);
          await AsyncStorage.setItem('cachedData', JSON.stringify({ cachedImages: fetchedImages, lastapiRes: JSON.stringify(response.data) }));
        }

      } 
      else {
        const URL = 'https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=20&page=1&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s';
        const response = await axios.get(URL);
        const fetchedImages = response.data.photos.photo;
        setImages(fetchedImages);
        await AsyncStorage.setItem('cachedData', JSON.stringify({ cachedImages: fetchedImages, lastapiRes: JSON.stringify(response.data) }));
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  return (
  
<div>
       <nav className="d-flex justify-content-between bg-danger text-white  overflow-hidden  header1" >

        <h1 className="fs-3 mx-2 mt-3" style={{ fontFamily: "serif,Arial" }}>Home</h1>
      </nav>
      <Container>
        <Card className='mt-5'>
          <Card.Header style={{ textAlign: 'center' }}>Image-Gallery-App</Card.Header>
          <Card.Body>
      <div >
        {images.map(image => (
          <img className="img1" key={image.id} src={image.url_s} alt={image.title} />
        ))}
      </div>
   
            <br></br>
            <h6 className='text-center text-danger'>Recent Pics</h6>



          </Card.Body>

        </Card>
        
     </Container>

    </div> 
      
  )

}

export default Home;
