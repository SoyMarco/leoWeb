import { Row, Col, Divider } from "antd";
import PropTypes from "prop-types";
import "./BDivider.css";

const BDivider = ({ title, style }) => (
	<Row>
		<Col span={24}>
			<Divider orientation='left' style={style} className='BDivider'>
				<h3 className='BDivider'>{title}</h3>
			</Divider>
		</Col>
	</Row>
);

BDivider.propTypes = {
	title: PropTypes.string,
	style: PropTypes.object,
};

BDivider.defaultProps = {
	title: "BDivider_Insert Title ",
	style: {
		fontSize: "17px",
		color: "darkBlue",
		borderTopColor: "darkBlue",
		fontWeight: "500",
	},
};

export default BDivider;
