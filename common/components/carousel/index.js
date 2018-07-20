import Carousel from './main';
import CarouselItem from './item';

/* istanbul ignore next */
export default function install(Vue) {
  Vue.component(Carousel.name, Carousel);
  Vue.component(CarouselItem.name, CarouselItem);
}

export { Carousel, CarouselItem };

// 轮播