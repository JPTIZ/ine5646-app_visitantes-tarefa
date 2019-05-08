import React, { useState, useEffect } from 'react'
import {Panel} from 'primereact/panel'
import {Button} from 'primereact/button'
import {Chart} from 'primereact/chart'

import 'primereact/resources/themes/nova-light/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'


const App = () => {
  const [{estado, EnumEstados, dados}, {setEstado, fechaGrafico}] = useModelo()

  let conteudo

  switch (estado) {
  case EnumEstados.INICIAL: {
    conteudo = <Button label='Obter Dados' onClick={() => setEstado(EnumEstados.EXIBINDO)}/>
    break
  }
  case EnumEstados.EXIBINDO: {
    if (dados === undefined)
      break
    const dadosDoGrafico = {
      labels: dados.meses,
      datasets: [
        {
          label: 'Visitantes',
          backgroundColor: 'blue',
          data: dados.visitantes
        }
      ]
    }
    conteudo = 
      <Panel header='Dados dos Visisantes'>
        <Button label='Fechar' onClick={fechaGrafico}/>
        <Chart type='bar' data={dadosDoGrafico}/>
      </Panel>
  }
  }

  return (
    <Panel header='UFSC - CTC - INE INE5646 - App Visitantes'>
      <div>{conteudo}</div>
    </Panel>
  )

}

function useModelo() {
  const EnumEstados = {
    INICIAL : 0,
    EXIBINDO : 1,
  }
  const [estado, setEstado] = useState(EnumEstados.INICIAL)
  const [dados, setDados] = useState(undefined)

  useEffect(() => {
    if (estado === EnumEstados.EXIBINDO && dados === undefined) {
      window.fetch('/dados')
        .then(r => r.json())
        .then((dadosEmArray) => {
          setDados(extraiMesesEVisitantes(dadosEmArray))
        })
    }  
  }, [estado])


  function fechaGrafico() {
    setEstado(EnumEstados.INICIAL)
    setDados(undefined)
  }

  return [{estado, dados, EnumEstados}, {setEstado, fechaGrafico}]
}

/**
 * dados : [ [mes, visitantes], ..., [mes, visitantes]]
 * 
 * retorna : {meses: [mes, ..., mes], visitantes: [visitantes, ..., visitantes]}
 */
function extraiMesesEVisitantes(dados) {
  // reducer : (acumulado, dado) => novo acumulado
  const reducer = ([meses, visitantes], [mes, vis]) => [meses.concat(mes), visitantes.concat(vis)]
  const inicial = [[],[]]
  const [meses, visitantes] = dados.reduce(reducer, inicial)
  return {meses, visitantes}
}

export default App
