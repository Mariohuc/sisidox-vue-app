import { SnackBarParams } from "./store/models"
import { GeneralError } from "./utilities/generalError"

export function getSnackBarErrorParams(error: any): SnackBarParams {
  if( error.response?.status ){
    switch ( error.response.status ){
      case 400: return { snackbar: true, color: 'warning', text: error.response.data?.message || 'Solicitud erronea', timeout: 15000 }
      case 401: return { snackbar: true, color: 'warning', text: error.response.data?.message || 'Usted no esta autorizado para ejecutar esta acción', timeout: 15000 }
      case 404: return { snackbar: true, color: 'error', text: error.response.data?.message || 'El recurso solicitado no existe', timeout: 15000 }      
      case 500: return { snackbar: true, color: 'error', text: 'Error interno, por favor intentelo en otro momento', timeout: 8000 }
      default: return { snackbar: true, color: 'error', text: 'Error desconocido, por favor intentelo en otro momento', timeout: 8000 }
    }
  } else if( error instanceof GeneralError ) {     
    return { snackbar: true, color: 'error', text: error.message, timeout: 8000 }
  }else{
    return { snackbar: true, color: 'error', text: 'Error interno, por favor intentelo en otro momento', timeout: 8000 }
  }
}