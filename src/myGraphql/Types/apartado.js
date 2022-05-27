const typeApartado = `{
			id
			vendedor
			cliente
			folio
			total
			referencia
			notas
			createAt
			vence
			tipo
			productos {
				vendedor
				nombre
				precio
				cantidad
				totalArticulo
				idArray
				_id
				createAt
				tipo
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
				tipo
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

export { typeApartado };
