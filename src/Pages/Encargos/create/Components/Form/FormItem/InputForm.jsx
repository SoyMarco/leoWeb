import { Input, Form } from "antd";
import { keyBlockFs } from "Utils";

export default function InputForm({
	label,
	name,
	required = false,
	reference,
	onKeyUp,
	tooltip,
}) {
	return (
		<Form.Item
			label={<h3>{label}</h3>}
			name={name}
			required={required}
			tooltip={tooltip}
			rules={[
				{
					required: required,
				},
			]}
		>
			<Input ref={reference} onKeyUp={onKeyUp} onKeyDown={keyBlockFs} />
		</Form.Item>
	);
}
