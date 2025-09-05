interface ITitleProps {
	title: string;
}

const Title = ({ title }: ITitleProps) => {
	return (
		<div className="title">
			<div className="title-text">{title}</div>
		</div>
	);
};

export default Title;
