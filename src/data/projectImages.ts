const modules = import.meta.glob('../assets/projects/*.jpg', {
  eager: true,
  import: 'default',
}) as Record<string, string>

export const projectImages: Record<string, string> = {}

for (const path in modules) {
  const key = path.split('/').pop()!.replace('.jpg', '')
  projectImages[key] = modules[path]
}
