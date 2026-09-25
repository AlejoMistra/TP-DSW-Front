import type { Instructor } from '@/features/instructors/models/Instructor'

export function getInstructorName(
  instructors: Instructor[],
  instructorId?: string | number,
): string {
  if (instructorId === undefined || instructorId === null) {
    return 'Sin asignar'
  }

  const found = instructors.find(
    (instructor) => String(instructor.id) === String(instructorId),
  )

  return found
    ? `${found.name} ${found.surname}`
    : 'Sin asignar'
}