export type Instructor = {
  id: number
  name: string
  surname: string
  email: string
  phone: string | null
  joinDate?: string
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

export type CreateInstructorInput = {
  name: string
  surname: string
  email: string
  phone: string | null
}

export type UpdateInstructorInput = Partial<CreateInstructorInput>