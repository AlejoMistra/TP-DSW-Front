import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ClassSessionCard from './ClassSessionCard'
import type { MemberClassSession } from '../models/ClassSession'

const createClassSession = (
  overrides: Partial<MemberClassSession> = {},
): MemberClassSession => ({
  id: 1,
  classScheduleId: 10,
  date: '2026-10-10',
  startTime: '18:00',
  remainingCapacity: 5,
  status: 'SCHEDULED',
  isReserved: false,
  classSchedule: {
    id: 10,
    name: 'Funcional',
    description: 'Clase de entrenamiento funcional',
    category: 'FUNCTIONAL',
    durationMinutes: 60,
    maxCapacity: 15,
  },
  ...overrides,
})

describe('ClassSessionCard', () => {
  it('muestra el nombre, horario, cupos y botón para reservar una clase disponible', () => {
    const onToggleReservation = vi.fn()
    const classSession = createClassSession()

    render(
      <ClassSessionCard
        cls={classSession}
        onToggleReservation={onToggleReservation}
      />,
    )

    expect(screen.getByText('Funcional')).toBeInTheDocument()
    expect(screen.getByText('18:00')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText(/de 15 libres/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Reservar' }),
    ).toBeInTheDocument()
  })

  it('permite reservar una clase disponible', async () => {
    const user = userEvent.setup()
    const onToggleReservation = vi.fn()
    const classSession = createClassSession({
      id: 25,
      remainingCapacity: 4,
    })

    render(
      <ClassSessionCard
        cls={classSession}
        onToggleReservation={onToggleReservation}
      />,
    )

    const button = screen.getByRole('button', {
      name: 'Reservar',
    })

    expect(button).toBeEnabled()

    await user.click(button)

    expect(onToggleReservation).toHaveBeenCalledWith(25)
  })

  it('muestra agotado, indica sin cupos y no dispara la reserva al clickear', async () => {
    const user = userEvent.setup()
    const onToggleReservation = vi.fn()
    const classSession = createClassSession({
      remainingCapacity: 0,
      isReserved: false,
    })

    render(
      <ClassSessionCard
        cls={classSession}
        onToggleReservation={onToggleReservation}
      />,
    )

    expect(screen.getByText('Sin cupos')).toBeInTheDocument()

    const button = screen.getByRole('button', {
      name: 'Agotado',
    })

    expect(button).toBeDisabled()

    await user.click(button)
    expect(onToggleReservation).not.toHaveBeenCalled()
  })

  it('permite cancelar una reserva existente', async () => {
    const user = userEvent.setup()
    const onToggleReservation = vi.fn()
    const classSession = createClassSession({
      id: 30,
      isReserved: true,
      userBookingId: 100,
      remainingCapacity: 4,
    })

    render(
      <ClassSessionCard
        cls={classSession}
        onToggleReservation={onToggleReservation}
      />,
    )

    const button = screen.getByRole('button', {
      name: 'Cancelar Reserva',
    })

    expect(button).toBeEnabled()

    await user.click(button)

    expect(onToggleReservation).toHaveBeenCalledWith(30)
  })

  it('muestra cancelada y no dispara acción al clickear para una clase cancelada', async () => {
    const user = userEvent.setup()
    const onToggleReservation = vi.fn()
    const classSession = createClassSession({
      status: 'CANCELLED',
      isReserved: false,
    })

    render(
      <ClassSessionCard
        cls={classSession}
        onToggleReservation={onToggleReservation}
      />,
    )

    const button = screen.getByRole('button', {
      name: 'Cancelada',
    })

    expect(button).toBeDisabled()

    await user.click(button)
    expect(onToggleReservation).not.toHaveBeenCalled()
  })

  it('muestra el estado "Reservando..." y deshabilita el botón cuando isSubmitting es true al reservar', async () => {
    const user = userEvent.setup()
    const onToggleReservation = vi.fn()
    const classSession = createClassSession({ isReserved: false })

    render(
      <ClassSessionCard
        cls={classSession}
        onToggleReservation={onToggleReservation}
        isSubmitting={true}
      />,
    )

    const button = screen.getByRole('button', {
      name: /Reservando\.\.\./i,
    })

    expect(button).toBeDisabled()

    await user.click(button)
    expect(onToggleReservation).not.toHaveBeenCalled()
  })

  it('muestra el estado "Cancelando..." y deshabilita el botón cuando isSubmitting es true al cancelar', async () => {
    const user = userEvent.setup()
    const onToggleReservation = vi.fn()
    const classSession = createClassSession({ isReserved: true })

    render(
      <ClassSessionCard
        cls={classSession}
        onToggleReservation={onToggleReservation}
        isSubmitting={true}
      />,
    )

    const button = screen.getByRole('button', {
      name: /Cancelando\.\.\./i,
    })

    expect(button).toBeDisabled()

    await user.click(button)
    expect(onToggleReservation).not.toHaveBeenCalled()
  })

  it('muestra el nombre del instructor asignado con el prefijo Profe', () => {
    const onToggleReservation = vi.fn()
    const classSession = createClassSession({
      instructor: {
        id: 1,
        name: 'Carlos',
        surname: 'Gómez',
        email: 'carlos@gym.com',
        phone: '123456789',
      },
    })

    render(
      <ClassSessionCard
        cls={classSession}
        onToggleReservation={onToggleReservation}
      />,
    )

    expect(screen.getByText('Profe Carlos Gómez')).toBeInTheDocument()
  })
})