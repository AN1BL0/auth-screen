const API_URL = import.meta.env.VITE_API_URL as string

interface RequestOptions extends RequestInit {
    token?: string | null
}

export async function apiRequest<T>(
    path: string,
    options: RequestOptions = {},
): Promise<T> {
    const headers = new Headers(options.headers)

    headers.set('Content-Type', 'application/json')

    if (options.token) {
        headers.set('Authorization', `Bearer ${options.token}`)
    }

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => null)

        throw new Error(errorData?.message || 'Something went wrong')
    }

    if (response.status === 204) {
        return undefined as T
    }

    return response.json() as Promise<T>
}