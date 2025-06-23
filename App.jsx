import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Baby, Heart, Calendar, Weight, Ruler } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import './App.css'

function App() {
  const [palpites, setPalpites] = useState([])
  const [formData, setFormData] = useState({
    nome: '',
    sexo: '',
    peso: '',
    tamanho: '',
    dataNascimento: ''
  })

  // Carregar palpites do localStorage ao inicializar
  useEffect(() => {
    const palpitesSalvos = localStorage.getItem('palpitesBebe')
    if (palpitesSalvos) {
      setPalpites(JSON.parse(palpitesSalvos))
    }
  }, [])

  // Salvar palpites no localStorage sempre que a lista mudar
  useEffect(() => {
    localStorage.setItem('palpitesBebe', JSON.stringify(palpites))
  }, [palpites])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.nome && formData.sexo && formData.peso && formData.tamanho && formData.dataNascimento) {
      const novoPalpite = {
        id: Date.now(),
        ...formData,
        peso: parseFloat(formData.peso),
        tamanho: parseInt(formData.tamanho),
        timestamp: new Date().toLocaleString('pt-BR')
      }
      setPalpites(prev => [...prev, novoPalpite])
      setFormData({
        nome: '',
        sexo: '',
        peso: '',
        tamanho: '',
        dataNascimento: ''
      })
    }
  }

  // Função para formatar data corretamente
  const formatarData = (dataString) => {
    const [ano, mes, dia] = dataString.split('-')
    return `${dia}/${mes}/${ano}`
  }

  // Preparar dados para os gráficos
  const dadosSexo = [
    { sexo: 'Masculino', quantidade: palpites.filter(p => p.sexo === 'masculino').length },
    { sexo: 'Feminino', quantidade: palpites.filter(p => p.sexo === 'feminino').length }
  ]

  const CORES = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1']

  // Calcular média de peso e tamanho
  const mediaPeso = palpites.length > 0 ? (palpites.reduce((acc, curr) => acc + curr.peso, 0) / palpites.length).toFixed(2) : 0
  const mediaTamanho = palpites.length > 0 ? (palpites.reduce((acc, curr) => acc + curr.tamanho, 0) / palpites.length).toFixed(2) : 0

  const dadosMedias = [
    { nome: 'Peso Médio', valor: parseFloat(mediaPeso) },
    { nome: 'Tamanho Médio', valor: parseFloat(mediaTamanho) }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Baby className="w-8 h-8 text-pink-500" />
            <h1 className="text-4xl font-bold text-gray-800">Palpites do Bebê</h1>
            <Heart className="w-8 h-8 text-pink-500" />
          </div>
          <p className="text-lg text-gray-600">Faça seu palpite sobre os detalhes do nascimento!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Baby className="w-5 h-5" />
                Faça seu Palpite
              </CardTitle>
              <CardDescription>
                Preencha todos os campos para registrar seu palpite
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nome">Seu Nome</Label>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Digite seu nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="sexo">Sexo do Bebê</Label>
                  <Select value={formData.sexo} onValueChange={(value) => handleInputChange('sexo', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="peso" className="flex items-center gap-1">
                    <Weight className="w-4 h-4" />
                    Peso (kg)
                  </Label>
                  <Input
                    id="peso"
                    type="number"
                    step="0.1"
                    min="1"
                    max="6"
                    placeholder="Ex: 3.2"
                    value={formData.peso}
                    onChange={(e) => handleInputChange('peso', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tamanho" className="flex items-center gap-1">
                    <Ruler className="w-4 h-4" />
                    Tamanho (cm)
                  </Label>
                  <Input
                    id="tamanho"
                    type="number"
                    min="30"
                    max="70"
                    placeholder="Ex: 50"
                    value={formData.tamanho}
                    onChange={(e) => handleInputChange('tamanho', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="dataNascimento" className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Data de Nascimento
                  </Label>
                  <Input
                    id="dataNascimento"
                    type="date"
                    value={formData.dataNascimento}
                    onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Registrar Palpite
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Estatísticas dos Palpites</CardTitle>
              <CardDescription>
                Total de palpites: {palpites.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {palpites.length > 0 ? (
                <div className="space-y-6">
                  {/* Gráfico de Sexo */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Distribuição por Sexo</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={dadosSexo}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ sexo, quantidade }) => `${sexo}: ${quantidade}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="quantidade"
                        >
                          {dadosSexo.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Gráfico de Médias (Peso e Tamanho) */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Médias dos Palpites</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={dadosMedias}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="nome" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="valor" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Ainda não há palpites registrados. Seja o primeiro!
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Lista de Palpites */}
        {palpites.length > 0 && (
          <Card className="mt-8 shadow-lg">
            <CardHeader>
              <CardTitle>Todos os Palpites</CardTitle>
              <CardDescription>
                Lista completa de todos os palpites registrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-semibold">Nome</th>
                      <th className="text-left p-2 font-semibold">Sexo</th>
                      <th className="text-left p-2 font-semibold">Peso (kg)</th>
                      <th className="text-left p-2 font-semibold">Tamanho (cm)</th>
                      <th className="text-left p-2 font-semibold">Data de Nascimento</th>
                      <th className="text-left p-2 font-semibold">Registrado em</th>
                    </tr>
                  </thead>
                  <tbody>
                    {palpites.map((palpite) => (
                      <tr key={palpite.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">{palpite.nome}</td>
                        <td className="p-2 capitalize">{palpite.sexo}</td>
                        <td className="p-2">{palpite.peso} kg</td>
                        <td className="p-2">{palpite.tamanho} cm</td>
                        <td className="p-2">{formatarData(palpite.dataNascimento)}</td>
                        <td className="p-2 text-sm text-gray-500">{palpite.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default App

