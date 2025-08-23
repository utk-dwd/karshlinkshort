import { useLinkStore } from '@/store/linkStore';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { FolderPlus, FolderOpen, Link2, MoreHorizontal, Edit3, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const Folders = () => {
  const { 
    folders, 
    links, 
    isAuthenticated, 
    isLoading, 
    error,
    createFolder, 
    deleteFolder,
    fetchAllData
  } = useLinkStore();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState<FolderColor>('BLUE');
  const { toast } = useToast();

  // Fetch data when the component mounts if the user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated, fetchAllData]);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    try {
      await createFolder({ name: newFolderName.trim(), color: newFolderColor });
      setNewFolderName('');
      setNewFolderColor('BLUE');
      setIsCreateOpen(false);
      toast({ title: "Folder created successfully" });
    } catch (err) {
      toast({ title: "Failed to create folder", variant: "destructive" });
    }
  };

  const handleDeleteFolder = async (folderId: string, folderName: string) => {
    try {
      await deleteFolder(folderId);
      toast({ title: `Folder "${folderName}" deleted` });
    } catch (err) {
      toast({ title: "Failed to delete folder", variant: "destructive" });
    }
  };
  
  const handleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const getLinksInFolder = (folderId: string) => {
    return links.filter(link => link.folderId === folderId);
  };

  // Unauthenticated View
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card className="bento-card text-center p-8 max-w-md">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground mb-4">
              Please sign in to create and manage your link folders.
            </p>
            <Button onClick={handleLogin} className="bg-gradient-to-r from-primary to-primary-glow">
              Sign in with Google
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  // Loading View
  if (isLoading && folders.length === 0) {
    return (
        <Layout>
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        </Layout>
    );
  }

  // Authenticated View
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Folders</h1>
            <p className="text-muted-foreground">Organize your links into folders for better management</p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-primary-glow">
                <FolderPlus className="w-4 h-4 mr-2" />
                Create Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
                <DialogDescription>
                  Give your folder a name and choose a color.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="folder-name">Folder Name</Label>
                  <Input
                    id="folder-name"
                    placeholder="e.g., Work, Personal..."
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <Select value={newFolderColor} onValueChange={(value: FolderColor) => setNewFolderColor(value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.values(FolderColor).map(color => (
                        <SelectItem key={color} value={color}>
                          <div className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded-full bg-${color.toLowerCase()}-500`} />
                            <span>{color.charAt(0) + color.slice(1).toLowerCase()}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateFolder}>Create Folder</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bento-card bento-card-blue p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Total Folders</p>
                <p className="text-2xl font-bold text-white">{folders.length}</p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bento-card bento-card-green p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Total Links</p>
                <p className="text-2xl font-bold text-white">{links.length}</p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Link2 className="w-5 h-5 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bento-card bento-card-orange p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Organized</p>
                <p className="text-2xl font-bold text-white">
                  {Math.round((links.filter(l => l.folder).length / Math.max(links.length, 1)) * 100)}%
                </p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Folders Grid */}
        {folders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {folders.map((folder) => {
              const folderLinks = getLinksInFolder(folder.id);
              return (
                <Card key={folder.id} className={`bento-card bento-card-${folder.color.toLowerCase()} p-6 hover-lift`}>
                  {/* ... Card content ... */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteFolder(folder.id, folder.name)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {/* ... Rest of the card content ... */}
                   <div className="flex items-center justify-between text-white/80 text-sm">
                      <span>Created</span>
                      <span>{new Date(folder.createdAt).toLocaleDateString()}</span>
                    </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="bento-card text-center p-12">
            <div className="w-16 h-16 bg-muted/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No folders yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first folder to organize your links better
            </p>
            <Button onClick={() => setIsCreateOpen(true)} className="bg-gradient-to-r from-primary to-primary-glow">
              <FolderPlus className="w-4 h-4 mr-2" />
              Create Your First Folder
            </Button>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Folders;