import officeImg from '../office.jpg'
import doorImg from '../door.jpg'
import receptionImg from '../reception.jpg'
import outdoorImg from '../officeoutdoor.jpg'
import { blogPosts } from '../data/site'

export const blogImages = {
  office: officeImg,
  door: doorImg,
  reception: receptionImg,
  officeoutdoor: outdoorImg,
} as const

export type BlogImageKey = (typeof blogPosts)[number]['imageKey']

export function getBlogImage(imageKey: BlogImageKey) {
  return blogImages[imageKey]
}
