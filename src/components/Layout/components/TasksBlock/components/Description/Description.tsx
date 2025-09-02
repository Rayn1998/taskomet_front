interface IDescriptionProps {
	description: string;
}

const Description = ({ description }: IDescriptionProps) => {
	return (
		<div className="description">
			<div className="description-badge">DESCRIPTION</div>
			<div className="description-block">
				<div className="description-text-block">
					<div className="description-text">{description}</div>
				</div>
			</div>
		</div>
	);
};

export default Description;
