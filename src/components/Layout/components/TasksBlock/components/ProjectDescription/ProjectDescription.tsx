interface IProjectDataProps {
	description: string;
}

const ProjectDescription = ({ description }: IProjectDataProps) => {
	return (
		<div className="project-description">
			<div className="project-description-badge">DESCRIPTION</div>
			<div className="project-description-block">
				<div className="project-description-text-block">
					<div className="project-description-text">
						{description}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProjectDescription;
