/* eslint-disable max-len */
// @ts-ignore
import 'react-gallery-carousel/dist/index.css';
import '../productmanagersetsaddproduct.scss';

import React, {useState} from 'react';
import Carousel from 'react-gallery-carousel';
import {observer} from 'mobx-react';
import {imgStages} from '@/api/endpoints';

export const Carusel = observer(() => {
  const imgs = [
    {src: 'https://www.istockphoto.com/photo/abstract-topography-background-gm1907671388-554616950?utm_campaign=category_photos_top&utm_content=https%3A%2F%2Funsplash.com%2Fimages%2Fstock%2F4k&utm_medium=affiliate&utm_source=unsplash&utm_term=4k+images%3A%3A%3A'},
  ];

  return (
    <>
      <div>
        {/* <button onClick={handleDelete}>Delete</button> */}
        <Carousel
          images={imgs}
          canAutoPlay={false}
          isAutoPlaying={false}
          hasMediaButton={false}
          thumbnailHeight="80px"
          thumbnailWidth="80px"
          hasThumbnailsAtMax
          className="thumb"
          thumbnails={imgs.map(img => ({src: img.src, thumbnail: img.src}))}
        />
      </div>
    </>
  );
});
