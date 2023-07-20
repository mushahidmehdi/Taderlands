const scrollById = (id, offset) => {
	window.scrollTo({
		behavior: "smooth",
		top:
			document.getElementById(id).getBoundingClientRect().top -
			document.body.getBoundingClientRect().top +
			offset,
	});
};

export default function useScroll() {
	return scrollById;
}
