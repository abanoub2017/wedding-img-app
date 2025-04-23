import axios from './axios'

// Define interfaces for type safety
interface UploadImageParams {
    file: File
    uploaderName: string
    weddingId?: string
}

interface Image {
    _id: string
    url: string
    uploaderName: string
    weddingId: string
    uploadedBy: string
    createdAt: string
    updatedAt: string
}

class WeedingManageServices {
    // Upload an image
    async uploadImage({ file, uploaderName, weddingId = 'default' }: UploadImageParams): Promise<{ url: string; id: string }> {
        const formData = new FormData()
        formData.append('image', file)
        formData.append('uploadedBy', uploaderName)
        formData.append('uploaderName', uploaderName)
        formData.append('weddingId', weddingId)

        const response = await axios.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data
    }

    // Delete an image by ID
    async deleteImage(id: string): Promise<{ message: string }> {
        const response = await axios.delete(`/image/${id}`)
        return response.data
    }

    // Get all images (filtered by user role)
    // async getAllImages(): Promise<Image[]> {
    //     const response = await axios.get('/images')
    //     return response.data
    // }
    async getAllImages(userId: string, userRole: string = 'user'): Promise<Image[]> {
        const response = await axios.get('/images', {
            headers: {
                'x-user-id': userId,
                'x-user-role': userRole
            }
        });
        return response.data;
    }
    // Get images by wedding ID
    async getImagesByWeddingId(weddingId: string): Promise<Image[]> {
        const response = await axios.get(`/images/${weddingId}`)
        return response.data
    }

    // Get image by ID
    async getImageById(id: string): Promise<Image> {
        const response = await axios.get(`/image/${id}`)
        return response.data
    }
}

export default WeedingManageServices