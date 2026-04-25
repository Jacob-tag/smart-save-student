import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 bg-background gradient-hero">
      <div className="w-full max-w-md card-elevated p-8 lg:p-10 animate-scale-in">
        <Logo />
        <div className="mt-8">
          <h1 className="font-display font-bold text-2xl tracking-tight">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">Join thousands of students mastering their money.</p>
        </div>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="rname">Full name</Label>
            <Input id="rname" placeholder="Thando Mokoena" className="h-11" required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="remail">Email</Label>
            <Input id="remail" type="email" placeholder="you@university.ac.za" className="h-11" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select defaultValue="undergrad">
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="undergrad">Undergraduate</SelectItem>
                  <SelectItem value="postgrad">Postgraduate</SelectItem>
                  <SelectItem value="college">College</SelectItem>
                  <SelectItem value="highschool">High school</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="uni">University</Label>
              <Input id="uni" placeholder="UCT" className="h-11" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rpw">Password</Label>
            <Input id="rpw" type="password" placeholder="••••••••" className="h-11" required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rcpw">Confirm password</Label>
            <Input id="rcpw" type="password" placeholder="••••••••" className="h-11" required />
          </div>

          <Button type="submit" className="w-full h-11 shadow-soft mt-2">Create account</Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
