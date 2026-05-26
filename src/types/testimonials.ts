export type Testimonial = {
  id: string
  quote: string
  name: string
  location: string
  matter: string
  rating: number
  createdAt: string
  updatedAt: string
}

export type CreateTestimonialPayload = {
  quote: string
  name: string
  location: string
  matter: string
  rating: number
}

export type UpdateTestimonialPayload = Partial<CreateTestimonialPayload>

