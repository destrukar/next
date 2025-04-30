export default async function Page({ params }: { params: any}) {
	const id = params.id

	const res = await fetch(`https://api.vercel.app/blog/${id}`)
	const post = await res.json()

	return <div className='flex justify-center mt-2'>
		<article key={post.id} className="flex max-w-xl flex-col items-start justify-between">
	<div className="flex items-center gap-x-4 text-xs">
		<time dateTime={post.date} className="text-gray-500">
			{post.date}
		</time>
		<span
			className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
		>
			{post.category}
		</span>
	</div>
	<div className="group relative">
		<h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
			<span>
				<span className="absolute inset-0" />
				{post.title}
			</span>
		</h3>
		<p className="mt-5 text-sm/6 text-gray-600">{post.content}</p>
	</div>
</article>
	</div>
}