import personalInjuryImg from '../personal injury.jpg'
import immigrationImg from '../immigration.jpg'
import workersCompImg from '../workers compe.jpg'
import trafficImg from '../traffick.jpg'
import medicalImg from '../medical.jpg'
import realEstateImg from '../real.jpg'
import divorceImg from '../div.jpg'
import truckImg from '../truck.jpg'
export const practiceAreaImages = {
  personalInjury: personalInjuryImg,
  truckAccidents: truckImg,
  immigration: immigrationImg,
  workersComp: workersCompImg,
  traffic: trafficImg,
  medical: medicalImg,
  realEstate: realEstateImg,
  divorce: divorceImg,
} as const

export type PracticeAreaImageKey = keyof typeof practiceAreaImages

export function getPracticeAreaImage(imageKey: string) {
  return practiceAreaImages[imageKey as PracticeAreaImageKey]
}
