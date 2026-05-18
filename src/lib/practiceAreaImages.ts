import personalInjuryImg from '../personal injury.jpg'
import immigrationImg from '../immigration.jpg'
import workersCompImg from '../workers compe.jpg'
import trafficImg from '../traffick.jpg'
import medicalImg from '../medical.jpg'
import realEstateImg from '../real.jpg'
import divorceImg from '../div.jpg'
import { practiceAreas } from '../data/site'

export const practiceAreaImages = {
  personalInjury: personalInjuryImg,
  immigration: immigrationImg,
  workersComp: workersCompImg,
  traffic: trafficImg,
  medical: medicalImg,
  realEstate: realEstateImg,
  divorce: divorceImg,
} as const

export type PracticeAreaImageKey = (typeof practiceAreas)[number]['imageKey']

export function getPracticeAreaImage(imageKey: PracticeAreaImageKey) {
  return practiceAreaImages[imageKey]
}
