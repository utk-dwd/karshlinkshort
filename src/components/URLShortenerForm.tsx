import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { useLinkStore } from '@/store/linkStore';
import { useToast } from '@/hooks/use-toast';
import { Link2, Copy, Check } from 'lucide-react';

export const URLShortenerForm = () => {
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>();
  const [lastShortened, setLastShortened] = useState<string>('');
  const [copied, setCopied] = useState(false);
  
  const { addLink, folders } = useLinkStore();
  const { toast } = useToast();

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to shorten",
        variant: "destructive",
      });
      return;
    }

    if (!isValidUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL (including http:// or https://)",
        variant: "destructive",
      });
      return;
    }

    try {
      const linkId = addLink(url, alias || undefined, selectedFolder);
      const shortUrl = `karsh.link/${alias || 'generated'}`;
      setLastShortened(shortUrl);
      
      toast({
        title: "Link shortened successfully!",
        description: "Your short link is ready to use",
      });
      
      // Reset form
      setUrl('');
      setAlias('');
      setSelectedFolder(undefined);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to shorten URL. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`https://${lastShortened}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Short link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bento-card bento-card-purple p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center float-animation">
            <Link2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Shorten Your URL</h2>
            <p className="text-white/80">Transform long links into powerful short ones</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url" className="text-white/90">Long URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/very-long-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="alias" className="text-white/90">Custom Alias (Optional)</Label>
              <Input
                id="alias"
                type="text"
                placeholder="my-custom-link"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/90">Folder (Optional)</Label>
              <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Choose folder" />
                </SelectTrigger>
                <SelectContent>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full bg-${folder.color}`} />
                        <span>{folder.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-white text-purple hover:bg-white/90 hover-lift"
            size="lg"
          >
            <Link2 className="w-5 h-5 mr-2" />
            Shorten URL
          </Button>
        </form>
      </Card>

      {lastShortened && (
        <Card className="bento-card bento-card-green p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white mb-1">Your shortened link is ready!</h3>
              <p className="text-white/80 font-mono">{lastShortened}</p>
            </div>
            <Button
              onClick={copyToClipboard}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};