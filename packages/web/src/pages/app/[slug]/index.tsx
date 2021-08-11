import Link from 'next/link'

function Project() {
  const { project } = { project: { name: 'proj', slug: '/apples' } }

  return (
    <>
      <h1>{project.name}</h1>
      <Link href={`/app/${project.slug}/settings`}>Settings</Link>
    </>
  )
}

export default Project
