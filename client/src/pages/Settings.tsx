// Barrina Gardens CRM — Settings & Admin Page (Super Admin only)
import { useState } from 'react';
import { useAuth, CRMUser, UserRole } from '@/contexts/AuthContext';
import { Shield, UserPlus, Trash2, Edit2, Mail, Check, X, Eye, EyeOff, Crown, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { BGM_BRAND } from '@/lib/data';

const C = BGM_BRAND;

interface NewUserForm {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

const EMPTY_FORM: NewUserForm = { name: '', email: '', password: '', role: 'manager' };

export default function Settings() {
  const { user: currentUser, isSuperAdmin, users, addUser, removeUser, updateUser } = useAuth();
  const [showAddUser, setShowAddUser] = useState(false);
  const [form, setForm] = useState<NewUserForm>(EMPTY_FORM);
  const [showPwd, setShowPwd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<CRMUser>>({});
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Shield size={48} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">Access Restricted</p>
          <p className="text-sm text-gray-400 mt-1">Super Admin access required to view this page.</p>
        </div>
      </div>
    );
  }

  const handleAddUser = () => {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!form.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (users.some(u => u.email.toLowerCase() === form.email.toLowerCase())) {
      toast.error('A user with this email already exists');
      return;
    }
    addUser({ ...form, password: form.password });
    // Simulate sending invite email
    toast.success(`Invitation sent to ${form.email}`, {
      description: `${form.name} has been added as ${form.role === 'super_admin' ? 'Super Admin' : 'Manager'}.`,
    });
    setForm(EMPTY_FORM);
    setShowAddUser(false);
  };

  const handleStartEdit = (u: CRMUser) => {
    setEditingId(u.id);
    setEditForm({ name: u.name, email: u.email, role: u.role });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    updateUser(editingId, editForm);
    setEditingId(null);
    setEditForm({});
    toast.success('User updated successfully');
  };

  const handleDelete = (id: string) => {
    if (id === currentUser?.id) {
      toast.error("You can't delete your own account");
      return;
    }
    removeUser(id);
    setConfirmDelete(null);
    toast.success('User removed');
  };

  const getRoleBadge = (role: UserRole) => {
    if (role === 'super_admin') {
      return (
        <Badge className="text-xs" style={{ backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d' }}>
          <Crown size={10} className="mr-1" />
          Super Admin
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-xs text-gray-600">
        <User size={10} className="mr-1" />
        Manager
      </Badge>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Shield size={20} style={{ color: C.green }} />
            Admin Settings
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage users, permissions, and system settings</p>
        </div>
        <Button
          onClick={() => setShowAddUser(true)}
          style={{ backgroundColor: C.green, color: 'white' }}
        >
          <UserPlus size={16} className="mr-2" />
          Add New User
        </Button>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-700">
            System Users ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {users.map((u) => (
              <div key={u.id} className="px-4 py-3 flex items-center gap-4">
                {/* Avatar */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ backgroundColor: u.role === 'super_admin' ? C.green : '#6b7280', color: 'white' }}
                >
                  {u.avatar ? (
                    <img src={u.avatar} alt={u.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    u.name.charAt(0)
                  )}
                </div>

                {/* Info */}
                {editingId === u.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <Input
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))}
                      className="h-7 text-sm w-36"
                      placeholder="Name"
                    />
                    <Input
                      value={editForm.email || ''}
                      onChange={(e) => setEditForm(p => ({ ...p, email: e.target.value }))}
                      className="h-7 text-sm w-52"
                      placeholder="Email"
                    />
                    <Select value={editForm.role} onValueChange={(v) => setEditForm(p => ({ ...p, role: v as UserRole }))}>
                      <SelectTrigger className="h-7 text-xs w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-800">{u.name}</p>
                      {u.id === currentUser?.id && (
                        <span className="text-xs text-gray-400">(you)</span>
                      )}
                      {getRoleBadge(u.role)}
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Mail size={10} />
                      {u.email}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {editingId === u.id ? (
                    <>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={handleSaveEdit}>
                        <Check size={14} />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600" onClick={() => setEditingId(null)}>
                        <X size={14} />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600" onClick={() => handleStartEdit(u)} title="Edit user">
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => setConfirmDelete(u.id)}
                        disabled={u.id === currentUser?.id}
                        title="Remove user"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role Permissions Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-700">Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="border rounded-lg p-4" style={{ borderColor: '#fcd34d', backgroundColor: '#fffbeb' }}>
              <div className="flex items-center gap-2 mb-2">
                <Crown size={14} style={{ color: '#92400e' }} />
                <span className="font-semibold text-amber-800">Super Admin</span>
              </div>
              <ul className="space-y-1 text-xs text-amber-700">
                <li>✓ Full access to all modules</li>
                <li>✓ View financials & DMF data</li>
                <li>✓ Add & delete records</li>
                <li>✓ Retire residents</li>
                <li>✓ Update market values</li>
                <li>✓ Manage users & settings</li>
                <li>✓ All changes tracked</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4 border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <User size={14} className="text-gray-600" />
                <span className="font-semibold text-gray-700">Manager</span>
              </div>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>✓ View all resident & unit records</li>
                <li>✓ Edit existing records (tracked)</li>
                <li>✓ Add notes & contact logs</li>
                <li>✓ Manage tasks & appointments</li>
                <li>✗ Cannot view financials/DMF</li>
                <li>✗ Cannot add or delete records</li>
                <li>✗ Cannot retire residents</li>
                <li>✗ Cannot access settings</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus size={18} style={{ color: C.green }} />
              Add New User
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Full Name *</Label>
              <Input
                placeholder="e.g. Jane Smith"
                value={form.name}
                onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Email Address *</Label>
              <Input
                type="email"
                placeholder="jane.smith@barrinagardens.com.au"
                value={form.email}
                onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Temporary Password *</Label>
              <div className="relative">
                <Input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Set a temporary password"
                  value={form.password}
                  onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Role *</Label>
              <Select value={form.role} onValueChange={(v) => setForm(p => ({ ...p, role: v as UserRole }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">
                    <div className="flex items-center gap-2">
                      <Crown size={14} className="text-amber-600" />
                      Super Admin (full access)
                    </div>
                  </SelectItem>
                  <SelectItem value="manager">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-gray-500" />
                      Manager (limited access)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
              <Mail size={12} className="inline mr-1" />
              An invitation email will be sent to the user with their login credentials.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAddUser(false); setForm(EMPTY_FORM); }}>Cancel</Button>
            <Button
              onClick={handleAddUser}
              style={{ backgroundColor: C.green, color: 'white' }}
              disabled={!form.name || !form.email || !form.password}
            >
              <UserPlus size={14} className="mr-1" />
              Add User & Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-600">Remove User</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to remove <strong>{users.find(u => u.id === confirmDelete)?.name}</strong>? They will immediately lose access to the CRM.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => confirmDelete && handleDelete(confirmDelete)}>
              Remove User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
