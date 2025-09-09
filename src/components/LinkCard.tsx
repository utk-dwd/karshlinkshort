import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/store/linkStore';
import { useLinkStore } from '@/store/linkStore';
import { useToast } from '@/hooks/use-toast';
import { 
  ExternalLink, 
  Copy, 
  MoreHorizontal, 
  Trash2, 
  Edit3, 
  TrendingUp,
  Check 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LinkCardProps {
  link: Link;
  compact?: boolean;
}

export const LinkCard = ({ link, compact = false }: LinkCardProps) => {
  const [copied, setCopied] = useState(false);
  const { deleteLink, incrementClicks, folders } = useLinkStore();
  const { toast } = useToast();

  const folder = folders.find(f => f.id === link.folder);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`https://${link.shortUrl}`);
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

  const handleVisit = () => {
    incrementClicks(link.id);
    window.open(link.originalUrl, '_blank');
  };

  const handleDelete = () => {
    deleteLink(link.id);
    toast({
      title: "Link deleted",
      description: "The shortened link has been removed",
    });
  };

  if (compact) {
    return (
      <Card className="bento-card p-4 hover-lift">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{link.shortUrl}</p>
            <p className="text-xs text-muted-foreground truncate">{link.originalUrl}</p>
          </div>
          <div className="flex items-center space-x-2 ml-3">
            <span className="text-xs text-muted-foreground">{link.clicks} clicks</span>
            <Button variant="ghost" size="sm" onClick={copyToClipboard}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bento-card p-6 hover-lift">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-lg truncate">{link.shortUrl}</h3>
            {folder && (
              <Badge 
                variant="secondary" 
                className={`bg-${folder.color}/10 text-${folder.color} border-${folder.color}/20`}
              >
                {folder.name}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm truncate mb-1">{link.originalUrl}</p>
          <p className="text-xs text-muted-foreground">
            Created {link.createdAt.toLocaleDateString()}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={copyToClipboard}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleVisit}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span>{link.clicks} clicks</span>
          </div>
          <div className={`w-2 h-2 rounded-full ${link.isActive ? 'bg-green' : 'bg-gray-400'}`} />
          <span className="text-xs text-muted-foreground">
            {link.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={handleVisit}>
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};