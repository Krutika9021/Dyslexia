import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface GameResult {
  id: string;
  user_id: string;
  username: string;
  game_type: string;
  game_name: string;
  difficulty: string;
  score: number;
  has_dyslexia: boolean;
  completed_at: string;
}

export const AdminDashboard = () => {
  const [results, setResults] = useState<GameResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'dyslexia' | 'no-dyslexia'>('all');
  const { signOut } = useAuth();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      console.log('Fetching game results...');
      
      const { data, error } = await supabase
        .from('game_results')
        .select('*')
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error fetching results:', error);
        toast({
          title: "Error",
          description: "Failed to fetch game results",
          variant: "destructive"
        });
      } else {
        console.log('Fetched results:', data);
        // Process results to determine dyslexia based on score < 7
        const processedResults = data?.map(result => ({
          ...result,
          has_dyslexia: result.score < 7
        })) || [];
        setResults(processedResults);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getFilteredResults = () => {
    if (filter === 'dyslexia') {
      return results.filter(result => result.score < 7);
    } else if (filter === 'no-dyslexia') {
      return results.filter(result => result.score >= 7);
    }
    return results;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const filteredResults = getFilteredResults();
  const uniqueUsers = new Set(results.map(r => r.username)).size;
  const usersWithDyslexia = new Set(results.filter(r => r.score < 7).map(r => r.username)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Results Dashboard</h1>
            <p className="text-gray-600">View all user game results and dyslexia indicators (Score &lt; 7 indicates dyslexia)</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={fetchResults} variant="outline">
              Refresh Data
            </Button>
            <Button onClick={signOut} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{uniqueUsers}</div>
              <p className="text-gray-600">Total Users</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{results.length}</div>
              <p className="text-gray-600">Total Game Sessions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-red-600">{usersWithDyslexia}</div>
              <p className="text-gray-600">Users with Dyslexia (Score &lt; 7)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">
                {new Set(results.map(r => r.game_type)).size}
              </div>
              <p className="text-gray-600">Different Game Types</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Game Results */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Detailed Game Results</CardTitle>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilter('all')}
                >
                  All
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'dyslexia' ? 'default' : 'outline'}
                  onClick={() => setFilter('dyslexia')}
                >
                  Dyslexia (Score &lt; 7)
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'no-dyslexia' ? 'default' : 'outline'}
                  onClick={() => setFilter('no-dyslexia')}
                >
                  No Dyslexia (Score ≥ 7)
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Game</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Dyslexia Risk</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">{result.username}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{result.game_name}</div>
                          <div className="text-gray-500 text-xs">{result.game_type}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={result.score < 7 ? "destructive" : "default"}>
                          {result.score}/10
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {result.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(result.completed_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={result.score < 7 ? "destructive" : "default"}>
                          {result.score < 7 ? 'High Risk' : 'Low Risk'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {results.length === 0 && (
          <Card className="mt-8">
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">
                No game results found. Users need to play games for data to appear here.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Make sure users are logged in when playing games for results to be saved.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
