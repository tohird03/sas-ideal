// @ts-ignore
import 'react-gallery-carousel/dist/index.css';
import '../workon.scss';

import React, {useState} from 'react';
import Carousel from 'react-gallery-carousel';
import {observer} from 'mobx-react';
import {imgStages} from '@/api/endpoints';
import {productListStore} from '@/stores/product_list/product_list';

export const Carusel = observer(() => {
  const [index, setIndex] = useState(0);
  const imgs = productListStore?.productIdData?.images?.map((image) => ({
    src: `${imgStages?.apiUrl}${image}`,
  }));

  const handleDelete = async () => {
    if (imgs && imgs.length > index) {
      const imageToDelete = imgs[index];

      console.log('Deleting image with src:',
        imageToDelete.src);
      setIndex((prevIndex) => (prevIndex === 0 ? 0 : prevIndex - 1));
    } else {
      console.log('No image to delete at the current index');
    }
  };

  const onSlideChange = (index: number) => {
    setIndex(index);
    console.log('Current image index:', index);
  };

  const onIndexChange = (newIndex: number) => {
    setIndex(newIndex);
    console.log('Current image index:', newIndex);
  };

  return (
    <>
      <div>
        {/* <button onClick={handleDelete}>Delete</button> */}
        <Carousel
          index={index}
          images={imgs || []}
          canAutoPlay={false}
          isAutoPlaying={false}
          hasMediaButton={false}
          thumbnailHeight="80px"
          thumbnailWidth="80px"
          hasThumbnailsAtMax
          className="thumb"
          thumbnails={imgs || []}
          onSlideChange={onSlideChange}
          onIndexChange={onIndexChange}
        />
      </div>
    </>
  );
});
