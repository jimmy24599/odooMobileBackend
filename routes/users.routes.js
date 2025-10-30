import express from 'express'
import { getUsers, getUserById, updateUser, getDevicesByIds, updateDevice } from '../controllers/users.controller.js'

const router = express.Router()
router.post('/', getUsers)
router.post('/by-id', getUserById)
router.put('/:id', updateUser)
router.post('/devices/by-ids', getDevicesByIds)
router.put('/devices/:id', updateDevice)
export default router
