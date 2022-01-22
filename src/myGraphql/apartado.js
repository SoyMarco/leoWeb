import gql from "graphql-tag";

export const GET_FOLIO_MAX_APARTADO = gql`
	mutation getFolioMaxApartado($input: BasicInput) {
		getFolioMaxApartado(input: $input) {
			folio
		}
	}
`;
const apartadoFolioType = `{
			id
			vendedor
			cliente
			folio
			total
			referencia
			notas
			createAt
			vence
			productos {
				vendedor
				nombre
				precio
				cantidad
				totalArticulo
				idArray
				_id
				createAt
				entregado {
					status
					fecha
					vendedor
				}
				sacado {
					status
					fecha
					vendedor
				}
				cancelado {
					status
					fecha
					vendedor
				}
			}
			abonos {
				_id
				idVenta
				folioVenta
				abono
				vendedor
				createAt
				cancel
				cancelado {
					status
					fecha
					vendedor
				}
			}
			entregado {
				status
				fecha
				vendedor
			}
			sacado {
				status
				fecha
				vendedor
			}
			cancelado {
				status
				fecha
				vendedor
			}
		}`;
export const GET_PRODUCTOS_FOLIO = gql`
	query getProductosFolio($folio: Float) {
		getProductosFolio(folio: $folio) ${apartadoFolioType}
	}
`;
export const GET_APARTADOS = gql`
	query getApartados {
		getApartados {
			id
			cliente
			folio
			total
			referencia
			notas
			vence
			vendedor
			createAt
			entregado {
				status
				fecha
				vendedor
			}
			sacado {
				status
				fecha
				vendedor
			}
			cancelado {
				status
				fecha
				vendedor
			}
			productos {
				vendedor
				nombre
				precio
				cantidad
				totalArticulo
				idArray
				_id
				createAt
				entregado {
					status
					fecha
					vendedor
				}
				sacado {
					status
					fecha
					vendedor
				}
				cancelado {
					status
					fecha
					vendedor
				}
			}
			abonos {
				_id
				idVenta
				folioVenta
				abono
				vendedor
				createAt
				cancel
				cancelado {
					status
					fecha
					vendedor
				}
			}
		}
	}
`;
export const GET_APARTADOS_BUSCADOR = gql`
	query getApartados {
		getApartados {
			id
			cliente
			folio
			vence
			entregado {
				status
				fecha
				vendedor
			}
			sacado {
				status
				fecha
				vendedor
			}
			cancelado {
				status
				fecha
				vendedor
			}
		}
	}
`;
export const ADD_ABONO = gql`
	mutation addAbono($input: AbonoApartadoInput) {
		addAbono(input: $input) {
			id
			vendedor
			cliente
			folio
			total
			referencia
			notas
			createAt
			vence
			productos {
				vendedor
				nombre
				precio
				cantidad
				totalArticulo
				idArray
				_id
				createAt
				entregado {
					status
					fecha
					vendedor
				}
				sacado {
					status
					fecha
					vendedor
				}
				cancelado {
					status
					fecha
					vendedor
				}
			}
			abonos {
				_id
				idVenta
				folioVenta
				abono
				vendedor
				createAt
				cancel
				cancelado {
					status
					fecha
					vendedor
				}
			}
			entregado {
				status
				fecha
				vendedor
			}
			sacado {
				status
				fecha
				vendedor
			}
			cancelado {
				status
				fecha
				vendedor
			}
		}
	}
`;
export const ADD_PRODUCTO = gql`
	mutation addProducto($input: ProductoApartadoInput) {
		addProducto(input: $input) {
			id
			vendedor
			cliente
			folio
			total
			referencia
			notas
			createAt
			vence
			productos {
				vendedor
				nombre
				precio
				cantidad
				totalArticulo
				idArray
				_id
				createAt
				entregado {
					status
					fecha
					vendedor
				}
				sacado {
					status
					fecha
					vendedor
				}
				cancelado {
					status
					fecha
					vendedor
				}
			}
			abonos {
				_id
				idVenta
				folioVenta
				abono
				vendedor
				createAt
				cancel
				cancelado {
					status
					fecha
					vendedor
				}
			}
			entregado {
				status
				fecha
				vendedor
			}
			sacado {
				status
				fecha
				vendedor
			}
			cancelado {
				status
				fecha
				vendedor
			}
		}
	}
`;
export const CANCEL_ENTREGA = gql`
	mutation cancelEntrega($input: cancelEntregaInput) {
		cancelEntrega(input: $input)
	}
`;
export const CANCELAR_PRODUCTO_APARTDO = gql`
	mutation cancelarProductoApartado($input: productoESCinput) {
		cancelarProductoApartado(input: $input) {
			id
		}
	}
`;
export const EDIT_VENCE_APARTADO = gql`
	mutation editVenceApartado($input: editVenceApartadoInput) {
		editVenceApartado(input: $input) {
			id
		}
	}
`;
export const BORRAR_EDITAR_ABONO = gql`
	mutation borrarEditarAbono($input: AbonoApartadoInput) {
		borrarEditarAbono(input: $input) ${apartadoFolioType}
	}
`;
export const CANCELAR_APARTADO = gql`
	mutation cancelarApartado($input: CancelarApartadoInput) {
		cancelarApartado(input: $input)
	}
`;
export const SEARCH_APARTADO = gql`
	query searchApartado($search: String) {
		searchApartado(search: $search) {
			id
			cliente
			folio
			vence
		}
	}
`;
export const REGISTER_APARTADO = gql`
	mutation registerApartado($input: ApartadoInput) {
		registerApartado(input: $input) {
			id
			vendedor
			cliente
			folio
			total
			referencia
			notas
			createAt
			vence
			productos {
				vendedor
				nombre
				precio
				cantidad
				totalArticulo
				idArray
				_id
				createAt
				entregado {
					status
					fecha
					vendedor
				}
				sacado {
					status
					fecha
					vendedor
				}
				cancelado {
					status
					fecha
					vendedor
				}
			}
			abonos {
				_id
				idVenta
				folioVenta
				abono
				vendedor
				createAt
				cancel
				cancelado {
					status
					fecha
					vendedor
				}
			}
			entregado {
				status
				fecha
				vendedor
			}
			sacado {
				status
				fecha
				vendedor
			}
			cancelado {
				status
				fecha
				vendedor
			}
		}
	}
`;
export const GET_PRODUCTS_NAME = gql`
	query getProductsName {
		getProductsName {
			value
			key
		}
	}
`;
export const GET_CLIENTS_NAMES = gql`
	query getClientsNames {
		getClientsNames {
			value
			key
		}
	}
`;

export const REGISTER_APARTADO_F3 = gql`
	mutation registerApartadoF3($input: ApartadoInput) {
		registerApartadoF3(input: $input) {
			id
			vendedor
			cliente
			folio
			total
			referencia
			notas
			createAt
			vence
			productos {
				vendedor
				nombre
				precio
				cantidad
				totalArticulo
				idArray
				_id
				createAt
				entregado {
					status
					fecha
					vendedor
				}
				sacado {
					status
					fecha
					vendedor
				}
				cancelado {
					status
					fecha
					vendedor
				}
			}
			abonos {
				_id
				idVenta
				folioVenta
				abono
				vendedor
				createAt
				cancel
				cancelado {
					status
					fecha
					vendedor
				}
			}
			entregado {
				status
				fecha
				vendedor
			}
			sacado {
				status
				fecha
				vendedor
			}
			cancelado {
				status
				fecha
				vendedor
			}
		}
	}
`;
