/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'lh3.googleusercontent.com',
            'i.scdn.co',
            'wxxjlbfkdcysszgjjlrw.supabase.co'
        ]
    },
    transpilePackages: ['three'],
}

module.exports = nextConfig
