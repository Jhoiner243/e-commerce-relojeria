import { ProductsType } from '../types'

export default function SectionMenAndWomen(producst: ProductsType) {
  const menProducts = producst.filter(product => product.categoriaName === 'Men')
  const womenProducts = producst.filter(product => product.categoriaName === 'Women')

  
  return (
    <div>
      
    </div>
  )
}
