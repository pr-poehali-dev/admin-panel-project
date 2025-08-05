import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';

interface Article {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  status: 'PROCESSING' | 'DONE' | 'ERROR';
  is_published: boolean;
  created_at: string;
  tags: string[];
}

interface ImageUpload {
  filename: string;
  original_name: string;
}

export default function Index() {
  const [articles, setArticles] = useState<Article[]>([
    {
      id: 1,
      title: "Understanding AI Ethics",
      slug: "understanding-ai-ethics",
      description: "An exploration of ethical considerations in artificial intelligence development...",
      content: "Artificial intelligence is rapidly transforming our world...",
      status: "DONE",
      is_published: true,
      created_at: "2024-08-05T10:30:00Z",
      tags: ["AI", "Ethics", "Technology"]
    },
    {
      id: 2,
      title: "Future of Machine Learning",
      slug: "future-of-machine-learning",
      description: "Exploring the latest trends and developments in ML...",
      content: "Machine learning continues to evolve at an unprecedented pace...",
      status: "PROCESSING",
      is_published: false,
      created_at: "2024-08-05T09:15:00Z",
      tags: ["ML", "Future", "Technology"]
    },
    {
      id: 3,
      title: "Web Development Best Practices",
      slug: "web-development-best-practices",
      description: "Essential practices for modern web development...",
      content: "Building robust web applications requires careful consideration...",
      status: "DONE",
      is_published: false,
      created_at: "2024-08-04T14:22:00Z",
      tags: ["Web", "Development", "Best Practices"]
    }
  ]);

  const [newArticle, setNewArticle] = useState({
    topic: '',
    additional_context_url: '',
    images: [] as ImageUpload[]
  });

  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [uploadedImages, setUploadedImages] = useState<ImageUpload[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DONE': return 'bg-green-100 text-green-800';
      case 'PROCESSING': return 'bg-yellow-100 text-yellow-800';
      case 'ERROR': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateArticle = async () => {
    const newId = Math.max(...articles.map(a => a.id)) + 1;
    const article: Article = {
      id: newId,
      title: "",
      slug: `temp-${Math.random().toString(36).substr(2, 8)}`,
      description: "",
      content: "",
      status: "PROCESSING",
      is_published: false,
      created_at: new Date().toISOString(),
      tags: []
    };
    
    setArticles([article, ...articles]);
    setNewArticle({ topic: '', additional_context_url: '', images: [] });
    
    // Simulate AI generation
    setTimeout(() => {
      setArticles(prev => prev.map(a => 
        a.id === newId 
          ? {
              ...a,
              title: `Статья на тему: ${newArticle.topic}`,
              description: `Автоматически сгенерированная статья о ${newArticle.topic.toLowerCase()}...`,
              content: `Содержание статьи о ${newArticle.topic}...`,
              slug: newArticle.topic.toLowerCase().replace(/\s+/g, '-'),
              status: "DONE" as const,
              tags: [newArticle.topic]
            }
          : a
      ));
    }, 2000);
  };

  const handleUpdateArticle = (updatedArticle: Article) => {
    setArticles(prev => prev.map(a => a.id === updatedArticle.id ? updatedArticle : a));
    setEditingArticle(null);
  };

  const togglePublish = (id: number) => {
    setArticles(prev => prev.map(a => 
      a.id === id ? { ...a, is_published: !a.is_published } : a
    ));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages: ImageUpload[] = Array.from(files).map(file => ({
        filename: `${Date.now()}-${file.name}`,
        original_name: file.name
      }));
      setUploadedImages(prev => [...prev, ...newImages]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Админка для блога</h1>
          <p className="text-gray-600">Управление статьями блога с автоматической генерацией контента</p>
        </div>

        <Tabs defaultValue="articles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <Icon name="FileText" size={16} />
              Статьи
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Icon name="Plus" size={16} />
              Создать
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-2">
              <Icon name="Image" size={16} />
              Изображения
            </TabsTrigger>
          </TabsList>

          {/* Articles List */}
          <TabsContent value="articles" className="space-y-4">
            <div className="grid gap-4">
              {articles.map((article) => (
                <Card key={article.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {article.title || 'Без названия'}
                          </h3>
                          <Badge className={getStatusColor(article.status)}>
                            {article.status}
                          </Badge>
                          {article.is_published && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Опубликовано
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">
                          {article.description || 'Описание отсутствует'}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>/{article.slug}</span>
                          <span>{new Date(article.created_at).toLocaleDateString('ru-RU')}</span>
                          <div className="flex gap-1">
                            {article.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingArticle(article)}
                            >
                              <Icon name="Edit" size={16} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Редактировать статью</DialogTitle>
                            </DialogHeader>
                            {editingArticle && (
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="edit-title">Заголовок</Label>
                                  <Input
                                    id="edit-title"
                                    value={editingArticle.title}
                                    onChange={(e) => setEditingArticle({
                                      ...editingArticle,
                                      title: e.target.value
                                    })}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-description">Описание</Label>
                                  <Textarea
                                    id="edit-description"
                                    value={editingArticle.description}
                                    onChange={(e) => setEditingArticle({
                                      ...editingArticle,
                                      description: e.target.value
                                    })}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-content">Контент</Label>
                                  <Textarea
                                    id="edit-content"
                                    value={editingArticle.content}
                                    onChange={(e) => setEditingArticle({
                                      ...editingArticle,
                                      content: e.target.value
                                    })}
                                    rows={6}
                                  />
                                </div>
                                <Button onClick={() => handleUpdateArticle(editingArticle)}>
                                  Сохранить изменения
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant={article.is_published ? "destructive" : "default"}
                          size="sm"
                          onClick={() => togglePublish(article.id)}
                        >
                          {article.is_published ? (
                            <>
                              <Icon name="EyeOff" size={16} />
                              Скрыть
                            </>
                          ) : (
                            <>
                              <Icon name="Eye" size={16} />
                              Опубликовать
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Create Article */}
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Sparkles" size={20} />
                  Создать статью с помощью ИИ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="topic">Тема статьи *</Label>
                  <Input
                    id="topic"
                    placeholder="Например: 'Искусственный интеллект в медицине'"
                    value={newArticle.topic}
                    onChange={(e) => setNewArticle({ ...newArticle, topic: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="context-url">Дополнительный контекст (URL)</Label>
                  <Input
                    id="context-url"
                    placeholder="https://example.com/reference-material"
                    value={newArticle.additional_context_url}
                    onChange={(e) => setNewArticle({ ...newArticle, additional_context_url: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Прикреплённые изображения</Label>
                  <div className="mt-2">
                    {newArticle.images.length > 0 ? (
                      <div className="space-y-2">
                        {newArticle.images.map((img, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <Icon name="Image" size={16} />
                            <span className="text-sm">{img.original_name}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Изображения не прикреплены</p>
                    )}
                  </div>
                </div>
                <Separator />
                <Button 
                  onClick={handleCreateArticle} 
                  disabled={!newArticle.topic.trim()}
                  className="w-full"
                >
                  <Icon name="Wand2" size={16} className="mr-2" />
                  Создать статью
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Images */}
          <TabsContent value="images">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Upload" size={20} />
                  Загрузка изображений
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="image-upload">Выберите изображения</Label>
                  <Input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mt-2"
                  />
                </div>
                {uploadedImages.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Загруженные изображения:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {uploadedImages.map((img, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon name="Image" size={16} />
                            <span className="text-sm font-medium">{img.original_name}</span>
                          </div>
                          <p className="text-xs text-gray-500">{img.filename}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}